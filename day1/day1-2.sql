-- using Gitpod and this GitHub Repo: https://github.com/lucasjellema/gitpod-oracle-database-23c-free
-- Oracle SQL and PL/SQL
-- Note: first run the DDL and DML statements in file day1-1.sql to create tables and load data

DECLARE
    TYPE REPLACEMENT_TYPE IS RECORD (
        SEARCH_STRING VARCHAR2(255),
        REPLACEMENT_STRING VARCHAR2(255)
    );
    TYPE REPLACEMENT_ARRAY IS
        TABLE OF REPLACEMENT_TYPE INDEX BY PLS_INTEGER;
    REPLACEMENTS  REPLACEMENT_ARRAY;
    L_DOC         CLOB;
    NEWLINE_BREAK VARCHAR2(2) := CHR(13)
                                 ||CHR(10);
    L_LINE        VARCHAR2(2000);

    PROCEDURE INSERT_LINE(
        P_LINE IN VARCHAR2
    ) IS
    BEGIN
        INSERT INTO LINES (
            LINE
        ) VALUES (
            P_LINE
        );
    END;

    PROCEDURE INITIALIZE_REPLACEMENTS_ARRAY IS
    BEGIN
        REPLACEMENTS(1).SEARCH_STRING := 'one';
        REPLACEMENTS(1).REPLACEMENT_STRING := '1ne';
        REPLACEMENTS(2).SEARCH_STRING := 'two';
        REPLACEMENTS(2).REPLACEMENT_STRING := '2wo';
        REPLACEMENTS(3).SEARCH_STRING := 'three';
        REPLACEMENTS(3).REPLACEMENT_STRING := '3hree';
        REPLACEMENTS(4).SEARCH_STRING := 'four';
        REPLACEMENTS(4).REPLACEMENT_STRING := '4our';
        REPLACEMENTS(5).SEARCH_STRING := 'five';
        REPLACEMENTS(5).REPLACEMENT_STRING := '5ive';
        REPLACEMENTS(6).SEARCH_STRING := 'six';
        REPLACEMENTS(6).REPLACEMENT_STRING := '6ix';
        REPLACEMENTS(7).SEARCH_STRING := 'seven';
        REPLACEMENTS(7).REPLACEMENT_STRING := '7even';
        REPLACEMENTS(8).SEARCH_STRING := 'eight';
        REPLACEMENTS(8).REPLACEMENT_STRING := '8ight';
        REPLACEMENTS(9).SEARCH_STRING := 'nine';
        REPLACEMENTS(9).REPLACEMENT_STRING := '9ine';
    END;

    FUNCTION PROCESSED(
        P_LINE IN VARCHAR2
    ) -- find the location of all spelled out numbers in the line (e.g. one, two, eight); then replace the first occurrence and recursively invoke this function
    RETURN VARCHAR2 IS
        L_LINE                    VARCHAR2(2000):= P_LINE;
        L_FOUND                   BOOLEAN := FALSE;
        L_FIRST_REPLACEMENT       REPLACEMENT_TYPE;
        L_FIRST_REPLACEMENT_INDEX PLS_INTEGER;
        L_INDEX                   PLS_INTEGER;
    BEGIN
 -- find first occurrence for any written out number
 -- if found - replace and invoke this function again
        FOR I IN 1..REPLACEMENTS.COUNT LOOP
            L_INDEX := INSTR(P_LINE, REPLACEMENTS(I).SEARCH_STRING );
            IF (L_INDEX>0
            AND (NOT L_FOUND
            OR L_INDEX < L_FIRST_REPLACEMENT_INDEX ) ) THEN
                L_FIRST_REPLACEMENT_INDEX:= L_INDEX;
                L_FIRST_REPLACEMENT := REPLACEMENTS(I);
                L_FOUND:= TRUE;
            END IF;
        END LOOP;

        IF (L_FOUND) THEN
            RETURN PROCESSED( REPLACE(P_LINE, L_FIRST_REPLACEMENT.SEARCH_STRING, L_FIRST_REPLACEMENT.REPLACEMENT_STRING));
        ELSE
            RETURN P_LINE;
        END IF;
    END;
BEGIN
    INITIALIZE_REPLACEMENTS_ARRAY();
    SELECT
        CONTENT INTO L_DOC
    FROM
        DOC;
    L_LINE := REGEXP_SUBSTR(L_DOC, '[^'
                                   || NEWLINE_BREAK
                                   || ']+', 1, 1, 'i', 0);
    INSERT_LINE(PROCESSED(L_LINE));
    FOR I IN 2..2000 LOOP
        L_LINE := REGEXP_SUBSTR(L_DOC, '[^'
                                       || NEWLINE_BREAK
                                       || ']+', 1, I, 'i', 0);
        EXIT WHEN L_LINE IS NULL;
        INSERT_LINE(PROCESSED(L_LINE));
    END LOOP;
END;

COMMIT;

WITH LINE_SUMS AS (
    SELECT
        TO_NUMBER( REGEXP_SUBSTR(LINE, '\d')
                   || REGEXP_SUBSTR(REVERSE(LINE), '\d') ) AS LINE_SUM
    FROM
        LINES
)
SELECT
    SUM(LINE_SUM)
FROM
    LINE_SUMS
/