import {
  createServer
} from "node:http";
import next from "next";
import moment from "moment";
import {
  Server
} from "socket.io";
import {
  PrismaClient
} from '@prisma/client'
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const db = new PrismaClient();
const app = next({
  dev,
  hostname,
  port
});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  let userSocketMap = {};
  // 当用户端连接时触发
  io.on('connection', (socket) => {
    // scoket连接对象传输对象
    let handshake = socket.handshake;
    // 获取连接者 email
    let {
      id: uid
    } = handshake.query;
    userSocketMap[uid] = {
      socketId: socket.id,
      ...handshake.query
    };
    // console.log("handshake.query = ", handshake.query)
    // 用户断开事件
    socket.on("disconnect", (reason) => {
      delete userSocketMap[uid];
    });
    // 用户聊天
    socket.on("chat", async ({
      comment,
      type,
      to,
      from,
      fromUser,
      toUser,
      conversation_id,
      conversationItem,
      messageItem,
      data
    }) => {
      const sent_at = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
      messageItem.sent_at = sent_at;
      if (userSocketMap[to]) {
        io.to(userSocketMap[to].socketId).emit('chat', {
          comment,
          type,
          conversationItem,
          messageItem,
          to,
          from,
          fromUser,
          toUser,
          conversation_id,
          data
        });
      }
      if (userSocketMap[uid]) {
        io.to(userSocketMap[uid].socketId).emit('chat', {
          comment,
          type,
          conversationItem,
          messageItem,
          to,
          from,
          fromUser,
          toUser,
          conversation_id,
          data
        });
      }
      await db.message.create({
        data: {
          conversation_id: Number(conversation_id),
          sender_id: from,
          message: comment,
          type
        },
      });
    })
  });
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});