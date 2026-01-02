// src/controllers/monitoringController.js

// Mock Data Generator
const generateMockData = () => {
    // Temp: 25-35°C
    const temp = (Math.random() * 10 + 25).toFixed(1);
    // Humidity: 60-90%
    const humidity = (Math.random() * 30 + 60).toFixed(1);
    // pH: 5.5 - 7.5
    const ph = (Math.random() * 2 + 5.5).toFixed(1);

    return {
        temperature: parseFloat(temp),
        humidity: parseFloat(humidity),
        ph: parseFloat(ph),
        timestamp: new Date()
    };
};

exports.getCurrentEnvironment = async (req, res) => {
    try {
        const { farmId } = req.params;
        // In real world, fetch from DB or IoT Gateway
        const data = generateMockData();
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy dữ liệu môi trường' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { farmId } = req.params;
        // Mock history: 24 points (last 24h)
        const history = [];
        const now = new Date();
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000); // minus i hours
            const point = generateMockData();
            point.timestamp = time;
            history.push(point);
        }
        res.json({ history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy lịch sử môi trường' });
    }
};
