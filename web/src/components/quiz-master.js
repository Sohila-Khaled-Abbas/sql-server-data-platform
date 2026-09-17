export function setupQuizMaster() {
  const container = document.getElementById('quizQuestionsContainer');
  const scoreDisplay = document.getElementById('quizScoreDisplay');
  const xpBadge = document.getElementById('quizXpBadge');
  if (!container) return;

  const questions = [
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
      explanation: 'Triggers in SQL Server execute per-statement, not per-row! An UPDATE modifying 5,000 rows fires the trigger exactly once. The trigger must join `inserted` and `deleted` using set-based SQL to stream all modified records into the audit table in a single atomic pass.'
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

  let solvedIds = JSON.parse(localStorage.getItem('omniflow_quiz_solved') || '[]');

  function updateScore() {
    const count = solvedIds.length;
    scoreDisplay.textContent = `${count} / ${questions.length} Solved`;
    const xp = count * 150;
    if (xpBadge) xpBadge.textContent = `${xp} XP`;
  }

  function render() {
    container.innerHTML = '';

    questions.forEach((q, idx) => {
      const isSolved = solvedIds.includes(q.id);
      const card = document.createElement('div');
      card.className = 'quiz-card card';
      card.innerHTML = `
        <div class="quiz-badge-row">
          <span class="badge badge-purple">${q.module}</span>
          <span class="badge ${isSolved ? 'badge-green' : 'badge-amber'}">${isSolved ? 'Completed ✅' : 'Question ' + (idx + 1)}</span>
        </div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oIdx) => `
            <button class="option-btn ${isSolved && oIdx === q.correctIndex ? 'correct' : ''}" data-qid="${q.id}" data-idx="${oIdx}">
              <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="expl-${q.id}" style="display: ${isSolved ? 'block' : 'none'};">
          <strong>Engineering Rationale:</strong> ${q.explanation}
        </div>
      `;

      const buttons = card.querySelectorAll('.option-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const qid = parseInt(btn.getAttribute('data-qid'), 10);
          const chosenIdx = parseInt(btn.getAttribute('data-idx'), 10);

          if (chosenIdx === q.correctIndex) {
            btn.classList.add('correct');
            document.getElementById(`expl-${qid}`).style.display = 'block';
            if (!solvedIds.includes(qid)) {
              solvedIds.push(qid);
              localStorage.setItem('omniflow_quiz_solved', JSON.stringify(solvedIds));
              updateScore();
            }
          } else {
            btn.classList.add('incorrect');
            setTimeout(() => btn.classList.remove('incorrect'), 1500);
          }
        });
      });

      container.appendChild(card);
    });

    updateScore();
  }

  render();
}
