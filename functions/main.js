export function updateStats(user, stats) {
    if (!user || !stats) return;

    con.query("SELECT * FROM users WHERE id = ?", [user], (err, rows) => {
        if (err) throw err;

        if (rows.length > 0) {
            if (stats.record) {
                con.query(`UPDATE users SET wins = wins + ?, attempts = attempts + 1, record = ? WHERE id = ?`, [stats.wins ? 1 : 0, stats.record ? stats.record : 0, user]);
            } else {
                con.query(`UPDATE users SET wins = wins + ?, attempts = attempts + 1  WHERE id = ?`, [stats.wins ? 1 : 0, user]);
            }
        } else {
            con.query("INSERT INTO users (id, wins, attempts, record) VALUES (?, ?, ?, ?)", [user, stats.wins ? 1 : 0, 1, stats.record]);
        }
    });
}

export async function getStats(user) {
    return new Promise((resolve, reject) => {
        if (!user) resolve(undefined);

        con.query("SELECT * FROM users WHERE id = ?", [user], (err, rows) => {
            if (err) return reject(err);

            if (rows.length > 0) {
                return resolve(rows[0]);
            } else {
                return resolve(undefined);
            }
        });
    });
}

export async function getLeaderboard(type) {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users ORDER BY ${type} DESC LIMIT 10`, (err, rows) => {
            if (err) return reject(err);

            if (rows.length > 0) {
                return resolve(rows);
            } else {
                return resolve(undefined);
            }
        });
    });
}
