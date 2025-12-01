const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Временное хранилище данных (в реальном приложении будет база данных)
let users = [];
let helpRequests = [];
let activeVolunteers = [];
let chats = [];

// Маршруты API

// Регистрация
app.post('/api/register', (req, res) => {
    const { name, email, password, phone } = req.body;
    
    // Проверяем, существует ли пользователь
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ 
            success: false, 
            message: 'Пользователь с таким email уже существует' 
        });
    }
    
    // Создаем нового пользователя
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // В реальном приложении нужно хешировать пароль!
        phone: phone || '',
        rating: 5.0,
        helpedCount: 0,
        receivedCount: 0,
        isVolunteer: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Не возвращаем пароль в ответе
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.json({
        success: true,
        user: userWithoutPassword
    });
});

// Вход
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Находим пользователя
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Неверный email или пароль' 
        });
    }
    
    // Не возвращаем пароль в ответе
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
        success: true,
        user: userWithoutPassword
    });
});

// Создание запроса помощи
app.post('/api/help-requests', (req, res) => {
    const { userId, title, description, category, location } = req.body;
    
    // Проверяем пользователя
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'Пользователь не найден' 
        });
    }
    
    // Создаем запрос помощи
    const newRequest = {
        id: Date.now(),
        userId,
        userName: user.name,
        title,
        description,
        category: category || 'Другое',
        location: location || { lat: 55.7558, lng: 37.6173 },
        status: 'active', // active, in_progress, completed, cancelled
        createdAt: new Date().toISOString(),
        volunteers: []
    };
    
    helpRequests.push(newRequest);
    
    // Уведомляем всех подключенных волонтеров через WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'new_help_request',
                request: newRequest
            }));
        }
    });
    
    res.json({
        success: true,
        request: newRequest
    });
});

// Получение активных запросов помощи
app.get('/api/help-requests', (req, res) => {
    const { lat, lng, radius = 5000 } = req.query;
    
    let filteredRequests = helpRequests.filter(req => req.status === 'active');
    
    // Фильтрация по расстоянию (если указаны координаты)
    if (lat && lng) {
        filteredRequests = filteredRequests.filter(request => {
            const distance = calculateDistance(
                parseFloat(lat), 
                parseFloat(lng), 
                request.location.lat, 
                request.location.lng
            );
            return distance <= radius;
        });
        
        // Добавляем расстояние к каждому запросу
        filteredRequests = filteredRequests.map(request => {
            const distance = calculateDistance(
                parseFloat(lat), 
                parseFloat(lng), 
                request.location.lat, 
                request.location.lng
            );
            return { ...request, distance: Math.round(distance) };
        });
        
        // Сортировка по расстоянию
        filteredRequests.sort((a, b) => a.distance - b.distance);
    }
    
    res.json({
        success: true,
        requests: filteredRequests
    });
});

// Обновление статуса волонтера
app.post('/api/volunteer-status', (req, res) => {
    const { userId, status, location } = req.body;
    
    // Находим пользователя
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Пользователь не найден' 
        });
    }
    
    // Обновляем статус волонтера
    users[userIndex].isVolunteer = status;
    
    // Обновляем список активных волонтеров
    if (status) {
        // Добавляем волонтера в активные
        const existingVolunteerIndex = activeVolunteers.findIndex(v => v.userId === userId);
        if (existingVolunteerIndex === -1) {
            activeVolunteers.push({
                userId,
                name: users[userIndex].name,
                location: location || { lat: 55.7558, lng: 37.6173 },
                lastActive: new Date().toISOString()
            });
        } else {
            activeVolunteers[existingVolunteerIndex].location = location;
            activeVolunteers[existingVolunteerIndex].lastActive = new Date().toISOString();
        }
    } else {
        // Удаляем волонтера из активных
        activeVolunteers = activeVolunteers.filter(v => v.userId !== userId);
    }
    
    // Уведомляем всех о изменении количества волонтеров
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'volunteer_count_update',
                count: activeVolunteers.length
            }));
        }
    });
    
    res.json({
        success: true,
        isVolunteer: status
    });
});

// Получение статистики
app.get('/api/stats', (req, res) => {
    const today = new Date().toDateString();
    const todayRequests = helpRequests.filter(req => 
        new Date(req.createdAt).toDateString() === today
    );
    
    const completedRequests = helpRequests.filter(req => 
        req.status === 'completed'
    ).length;
    
    res.json({
        success: true,
        stats: {
            todayRequests: todayRequests.length,
            activeVolunteers: activeVolunteers.length,
            completedRequests,
            totalUsers: users.length
        }
    });
});

// Обработка WebSocket соединений
wss.on('connection', (ws) => {
    console.log('Новое WebSocket соединение');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'chat_message':
                    // Обработка сообщения чата
                    handleChatMessage(data, ws);
                    break;
                    
                case 'volunteer_status':
                    // Обновление статуса волонтера
                    updateVolunteerStatus(data, ws);
                    break;
                    
                case 'help_request_response':
                    // Ответ на запрос помощи
                    handleHelpResponse(data, ws);
                    break;
            }
        } catch (error) {
            console.error('Ошибка обработки WebSocket сообщения:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('WebSocket соединение закрыто');
    });
});

// Обработка сообщений чата
function handleChatMessage(data, ws) {
    const { chatId, userId, userName, message } = data;
    
    // Находим или создаем чат
    let chat = chats.find(c => c.id === chatId);
    if (!chat) {
        chat = {
            id: chatId,
            participants: [],
            messages: []
        };
        chats.push(chat);
    }
    
    // Добавляем сообщение
    const chatMessage = {
        id: Date.now(),
        userId,
        userName,
        message,
        timestamp: new Date().toISOString()
    };
    
    chat.messages.push(chatMessage);
    
    // Отправляем сообщение всем участникам чата
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            // В реальном приложении нужно проверять, является ли клиент участником чата
            client.send(JSON.stringify({
                type: 'chat_message',
                ...chatMessage
            }));
        }
    });
}

// Обновление статуса волонтера через WebSocket
function updateVolunteerStatus(data, ws) {
    const { userId, status, location } = data;
    
    // Находим пользователя
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;
    
    // Обновляем статус
    users[userIndex].isVolunteer = status;
    
    // Обновляем активных волонтеров
    if (status) {
        const existingIndex = activeVolunteers.findIndex(v => v.userId === userId);
        if (existingIndex === -1) {
            activeVolunteers.push({
                userId,
                name: users[userIndex].name,
                location,
                lastActive: new Date().toISOString()
            });
        } else {
            activeVolunteers[existingIndex].location = location;
            activeVolunteers[existingIndex].lastActive = new Date().toISOString();
        }
    } else {
        activeVolunteers = activeVolunteers.filter(v => v.userId !== userId);
    }
    
    // Уведомляем всех о изменении
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify({
                type: 'volunteer_count_update',
                count: activeVolunteers.length
            }));
        }
    });
}

// Обработка ответа на запрос помощи
function handleHelpResponse(data, ws) {
    const { requestId, userId, response } = data;
    
    // Находим запрос
    const requestIndex = helpRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    const request = helpRequests[requestIndex];
    
    if (response === 'accept') {
        // Обновляем статус запроса
        request.status = 'in_progress';
        request.volunteerId = userId;
        
        // Уведомляем создателя запроса
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                // В реальном приложении нужно найти WebSocket соединение создателя запроса
                client.send(JSON.stringify({
                    type: 'request_accepted',
                    requestId,
                    volunteerId: userId
                }));
            }
        });
    }
}

// Вспомогательная функция для расчета расстояния
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Радиус Земли в км
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Расстояние в метрах
    
    return distance;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте в браузере: http://localhost:${PORT}`);
});