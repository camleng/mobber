let sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("server/mobbers.sqlite3");

const init = () => {
    db.serialize(() => {
        db.run(
            "CREATE TABLE IF NOT EXISTS MobbingSession (id int UNIQUE NOT NULL, inProgress boolean, remainingSeconds int NOT NULL, intervalIndex int)"
        );
        db.run(
            "CREATE TABLE IF NOT EXISTS Mobber (id int, name varchar(30), sessionId int, FOREIGN KEY(sessionId) REFERENCES MobbingSession(id))"
        );
        db.run("UPDATE MobbingSession set intervalIndex = NULL, inProgress = false");
    });
};

const createMobbingSession = (sessionId, inProgress, initialSeconds) => {
    db.serialize(() => {
        db.run(
            "INSERT OR IGNORE INTO MobbingSession (id, inProgress, remainingSeconds) VALUES (?, ?, ?)",
            [sessionId, inProgress, initialSeconds]
        );
    });
};

const setIntervalId = (sessionId, inProgress, intervalIndex) => {
    db.serialize(() => {
        db.run(
            "Update MobbingSession SET intervalIndex = ?, inProgress = ? WHERE id = ?",
            [intervalIndex, inProgress, sessionId]
        );
    });
};

const resetSession = (sessionId, initialSeconds) => {
    db.serialize(() => {
        db.run(
            "Update MobbingSession SET intervalIndex = ?, inProgress = ?, remainingSeconds = ? WHERE id = ?",
            [null, false, initialSeconds, sessionId]
        );
    });
};

const setRemainingSeconds = (sessionId, inProgress, remainingSeconds) => {
    db.serialize(() => {
        db.run(
            "Update MobbingSession SET remainingSeconds = ?, inProgress = ? WHERE id = ?",
            [remainingSeconds, inProgress, sessionId]
        );
    });
};

const getMobbingSession = (sessionId, callback) => {
    return db.get("SELECT * FROM MobbingSession WHERE id = ?", [sessionId], (err, row) =>
        callback(row)
    );
};

module.exports = {
    init,
    createMobbingSession,
    getMobbingSession,
    setIntervalId,
    setRemainingSeconds,
    resetSession,
};
