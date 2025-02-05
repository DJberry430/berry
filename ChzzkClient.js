const express = require('express');
const ChzzkClient = require('../utils/chzzkClient');  // 클라이언트 파일 불러오기
const router = express.Router();

const clients = {};  // 스트리머별 WebSocket 클라이언트 저장

// Chzzk WebSocket 연결 시작 API
router.get('/start/:streamerId', (req, res) => {
    const { streamerId } = req.params;

    if (clients[streamerId]) {
        return res.status(400).json({ error: 'Already connected' });
    }

    const client = new ChzzkClient(streamerId);

    client.on('messageChat', (message) => {
        console.log(`[${streamerId}] 채팅 메시지:`, message);
    });

    client.on('donationChat', (donation) => {
        console.log(`[${streamerId}] 후원 메시지:`, donation);
    });

    client.on('subscriptionChat', (subscription) => {
        console.log(`[${streamerId}] 구독 메시지:`, subscription);
    });

    client.connect();
    clients[streamerId] = client;

    res.json({ message: 'Connected to Chzzk WebSocket', streamerId });
});

// Chzzk WebSocket 연결 종료 API
router.get('/stop/:streamerId', (req, res) => {
    const { streamerId } = req.params;

    if (!clients[streamerId]) {
        return res.status(400).json({ error: 'Not connected' });
    }

    clients[streamerId].disconnect();
    delete clients[streamerId];

    res.json({ message: 'Disconnected from Chzzk WebSocket', streamerId });
});

// 현재 연결된 WebSocket 목록 API
router.get('/status', (req, res) => {
    res.json({ activeConnections: Object.keys(clients) });
});

module.exports = router;
