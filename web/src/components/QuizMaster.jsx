import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useProgress } from '../store/useProgressStore.js';

const QUESTIONS = [
  {
    id: 1,
    module: 'CH01: Storage & Internals',
    question: 'Why does an enterprise production database isolate active tables on DATA_FG and non-clustered indexes on INDEX_FG?',
    options: [
      'Because PRIMARY filegroups only support 100 tables maximum.',
      'To prevent head-contention between sequential bulk writes and random index b-tree seeks, and to enable piecemeal restores.',
      'Because non-clustered indexes cannot physically be created on the PRIMARY filegroup.',
      'To force SQL Server to use the older Sybase-compatible storage engine.'
    ],
    correctIndex: 1,
    explanation: 'Separating data from non-clustered indexes across independent physical drives isolates sequential IO from random IO seeks, and allows DBAs to restore the critical DATA_FG online first in disaster recovery scenarios while rebuilding indexes in the background.'
  },
  {
    id: 2,
    module: 'CH02: ACID & Transactions',
    question: 'What is the critical risk of running stored procedures with the default SET XACT_ABORT OFF in SQL Server?',
    options: [
      'The query will execute in single-threaded mode (MAXDOP 1).',
      'Runtime errors (e.g. FK violations) do not abort the batch, leaving transactions half-committed and holding orphaned exclusive locks.',
      'SQL Server triggers will fail to receive the inserted and deleted virtual tables.',
      'The execution plan will be purged from the plan cache after every run.'
    ],
    correctIndex: 1,
    explanation: 'With XACT_ABORT OFF, statements that hit constraint violations or type conversions continue executing the next statement in the batch! This results in corrupt partial transactions and leaves locks open. SET XACT_ABORT ON guarantees instant halt and doom state (XACT_STATE() = -1).'
  },
  {
    id: 3,
    module: 'CH02: Programmability & Functions',
    question: 'Why does an Inline Table-Valued Function (ITVF) drastically outperform a Multi-Statement TVF (MSTVF)?',
    options: [
      'MSTVFs can only return a maximum of 50 rows.',
      'An ITVF is treated as a macro and inlined into the outer query tree, enabling join pushdown, predicate pushdown, and accurate cardinality estimates.',
      'ITVFs are compiled into native C# CLR assemblies automatically.',
      'MSTVFs always run on the secondary replica in an Always On Availability Group.'
    ],
    correctIndex: 1,
    explanation: 'An Inline TVF is expanded directly into the outer query execution plan, allowing the optimizer to evaluate statistics and reorder joins. An MSTVF materializes an internal table variable in TempDB and uses a blind fixed 100-row cardinality estimate.'
  },
  {
    id: 4,
    module: 'CH03: Scalability & Partitioning',
    question: 'Why does the sliding-window ALTER TABLE ... SWITCH PARTITION execute in under 5 milliseconds even on 500 million rows?',
    options: [
      'It moves data asynchronously in the background using Service Broker.',
      'It compresses the rows using COLUMNSTORE_ARCHIVE before moving them.',
      'It is a pure metadata pointer swap in the system catalogs that reassigns page allocation ownership without moving physical data pages on disk.',
      'It temporarily drops all constraints on the table.'
    ],
    correctIndex: 2,
    explanation: 'Partition switching does zero disk IO! As long as the source and staging tables share identical filegroups, compression, and constraints, the storage engine simply swaps the extent allocation pointers in the metadata catalogs.'
  },
  {
    id: 5,
    module: 'CH04: Triggers & Governance',
    question: 'How should an audit trigger be coded in SQL Server to capture row updates safely?',
    options: [
      'Open a CURSOR over the table and inspect each row individually.',
      'Write a single set-based INSERT ... SELECT statement joining the virtual inserted and deleted memory tables.',
      'Call an external REST API synchronously inside the trigger body.',
      'Issue a COMMIT TRANSACTION inside the trigger.'
    ],
    correctIndex: 1,
    explanation: 'Triggers in SQL Server execute per-statement, not per-row! An UPDATE modifying 5,000 rows fires the trigger exactly once. The trigger must join inserted and deleted using set-based SQL to stream all modified records into the audit table in a single atomic pass.'
  },
  {
    id: 6,
    module: 'CH05: Kimball Data Warehousing',
    question: 'In a Kimball Star Schema, what is the primary purpose of a Slowly Changing Dimension (SCD) Type 2?',
    options: [
      'To overwrite past data immediately with new values without keeping history.',
      'To preserve historical reporting accuracy by creating a new surrogate key version with ValidFrom, ValidTo, and IsCurrent flags.',
      'To encrypt sensitive customer data using AES-256.',
      'To partition the fact table by fiscal quarter.'
    ],
    correctIndex: 1,
    explanation: 'SCD Type 2 creates a new version row when attributes change (e.g. customer relocates to a new city). Old sales remain linked to the old surrogate key, while new sales link to the new surrogate key, ensuring historical financial reports do not retroactively distort geographic revenue.'
  }
];

export default function QuizMaster() {
  const [solvedIds, setSolvedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('omniflow_quiz_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wrongAnswers, setWrongAnswers] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem('omniflow_quiz_solved', JSON.stringify(solvedIds));
    } catch (e) {
      console.error(e);
    }
  }, [solvedIds]);

  const handleSelectOption = (q, optIdx) => {
    if (solvedIds.includes(q.id)) return;

    if (optIdx === q.correctIndex) {
      setSolvedIds(prev => [...prev, q.id]);
      setWrongAnswers(prev => ({ ...prev, [q.id]: null }));
    } else {
      setWrongAnswers(prev => ({ ...prev, [q.id]: optIdx }));
      setTimeout(() => {
        setWrongAnswers(prev => ({ ...prev, [q.id]: null }));
      }, 1500);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all quiz progress?')) {
      setSolvedIds([]);
      setWrongAnswers({});
    }
  };

  const score = solvedIds.length;
  const total = QUESTIONS.length;
  const earnedXP = score * 150;

  return (
    <div className="quiz-master-hub">
      <div className="quiz-header">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="ms-badge">DBRE Certification Prep</div>
            <h1>SQL Server Systems Engineering & DBRE Assessment</h1>
            <p>Test your conceptual understanding of SQL Server 2022 architecture, concurrency, and dimensional data engineering.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="quiz-score-pill">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{score} / {total} Solved</span>
              <span className="quiz-xp-badge">+{earnedXP} XP</span>
            </div>
            {score > 0 && (
              <button onClick={handleReset} className="reset-quiz-btn" title="Reset Quiz">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="quiz-grid">
        {QUESTIONS.map((q, idx) => {
          const isSolved = solvedIds.includes(q.id);
          const wrongOpt = wrongAnswers[q.id];

          return (
            <div key={q.id} className={`quiz-card ${isSolved ? 'quiz-card-solved' : ''}`}>
              <div className="quiz-card-top">
                <span className="module-badge">{q.module}</span>
                <span className={`status-badge ${isSolved ? 'badge-emerald' : 'badge-amber'}`}>
                  {isSolved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                      Passed
                    </>
                  ) : (
                    `Question ${idx + 1}`
                  )}
                </span>
              </div>

              <h3 className="quiz-question-text">{q.question}</h3>

              <div className="quiz-options-list">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = isSolved && oIdx === q.correctIndex;
                  const isWrong = wrongOpt === oIdx;

                  let optClass = 'quiz-option-btn';
                  if (isCorrect) optClass += ' option-correct';
                  if (isWrong) optClass += ' option-incorrect';

                  return (
                    <button
                      key={oIdx}
                      className={optClass}
                      onClick={() => handleSelectOption(q, oIdx)}
                      disabled={isSolved}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + oIdx)}.</span>
                      <span className="opt-text">{opt}</span>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-auto" />}
                      {isWrong && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {isSolved && (
                <div className="quiz-explanation-box">
                  <div className="explanation-title">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
                    Engineering Rationale:
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
