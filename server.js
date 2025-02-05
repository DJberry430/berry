const express = require('express');
const cors = require('cors');
const chzzkRoutes = require('./routes/chzzk');

const app = express();
app.use(cors());
app.use(express.json());

// Chzzk API 라우트 추가
app.use('/api/chzzk', chzzkRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
