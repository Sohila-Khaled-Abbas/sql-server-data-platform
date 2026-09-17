using System;
using System.Data.SqlTypes;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.SqlServer.Server;

namespace OmniFlow.SqlClr
{
    /// <summary>
    /// Managed CLR extensions providing regex validation and cryptographic operations
    /// inside Microsoft SQL Server with native in-memory performance.
    /// </summary>
    public static class SqlClrExtensions
    {
        /// <summary>
        /// Deterministic Regular Expression pattern matcher.
        /// </summary>
        [SqlFunction(IsDeterministic = true, IsPrecise = true, DataAccess = DataAccessKind.None)]
        public static SqlBoolean RegexIsMatch(SqlString input, SqlString pattern)
        {
            if (input.IsNull || pattern.IsNull)
                return SqlBoolean.Null;

            try
            {
                // CompileRegex option can be cached or executed inline
                bool isMatch = Regex.IsMatch(input.Value, pattern.Value, RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(200));
                return new SqlBoolean(isMatch);
            }
            catch
            {
                return SqlBoolean.False;
            }
        }

        /// <summary>
        /// Computes SHA256 cryptographic hash of the input string, returning a hex string.
        /// Useful for high-volume data masking and surrogate key generation in ELT pipelines.
        /// </summary>
        [SqlFunction(IsDeterministic = true, IsPrecise = true, DataAccess = DataAccessKind.None)]
        public static SqlString ComputeSha256(SqlString input)
        {
            if (input.IsNull)
                return SqlString.Null;

            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input.Value);
                byte[] hash = sha256.ComputeHash(bytes);

                StringBuilder sb = new StringBuilder(hash.Length * 2);
                for (int i = 0; i < hash.Length; i++)
                {
                    sb.Append(hash[i].ToString("x2"));
                }
                return new SqlString(sb.ToString());
            }
        }
    }
}
