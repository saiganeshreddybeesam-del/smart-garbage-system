const http = require('http');

const request = (path, method = 'GET', data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });

        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

(async () => {
    try {
        console.log('Testing GET /api/bins');
        let res = await request('/api/bins');
        console.log(res.status);

        console.log('Testing GET /api/users/leaderboard');
        res = await request('/api/users/leaderboard');
        console.log(res.status);

        console.log('Testing POST /api/auth/register');
        res = await request('/api/auth/register', 'POST', { username: 'testuser', email: 'test@test.com', password: 'password123' });
        console.log(res.status, res.body);

    } catch (e) {
        console.error(e);
    }
})();
