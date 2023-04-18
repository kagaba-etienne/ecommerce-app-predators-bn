/* eslint-disable no-console */
// CLASS FOR HANDLING ALL CHAT DB OPERATIONS

import dotenv from 'dotenv';
import db from '../database/models/index.js';

dotenv.config();

export default class dbHandler {
  // Save socket to db
  static DOMAIN = `${process.env.DOMAIN_URL}/chatDB`;

  static async saveChat(message, userId, roomName) {
    try {
      const room = await dbHandler.getRoomByName(roomName);
      const roomId = room.id;
      const data = { userId, roomId, message };
      const chat = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/post/chat`,
        'POST',
        data,
      );
      return chat.id;
    } catch (error) {
      console.error('Error saving chat instance:', error);
      throw new Error('Failed to save chat instance');
    }
  }

  static async fetchChatHistory(roomName) {
    try {
      console.log('fch', roomName);
      const room = await dbHandler.getRoomByName(roomName);
      const roomId = room.id;
      const chatHistory = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/get/chat/${roomId}`,
        'GET',
      );
      if (!chatHistory) return null;

      return chatHistory;
    } catch (error) {
      console.error('Error saving chat instance:', error);
      throw new Error('Failed to save chat instance');
    }
  }

  static async saveSocketInstance(socketId, ipAddress, time) {
    try {
      const connectedAt = new Date(time).toISOString();
      const data = { socketId, ipAddress, connectedAt };
      const socket = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/post/socket`,
        'POST',
        data,
      );
      return socket.id;
    } catch (error) {
      console.error('Error saving socket instance:', error);
      throw new Error('Failed to save socket instance');
    }
  }

  // Delete socket in db
  static async deleteSocketInstance(id) {
    try {
      const data = { id };
      const response = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/delete/socket`,
        'DELETE',
        data,
      );
      return response;
    } catch (error) {
      console.log('Error deleting socket instance:', error.message);
      throw new Error('delete socket Error');
    }
  }

  // Get all sockets from db
  static async getAllSockets() {
    const res = db.SocketConnection.findAll();
    return res;
  }

  // Get in a room from db, or create if it doesn't exist. Return room id.
  static async getInRoom(socketId, name, newRoom = false) {
    try {
      console.log(name);
      const data = { name };
      const route = newRoom ? 'post/room' : 'post/getRoomByName';
      const room = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/${route}`,
        'POST',
        data,
      );
      const addToRoom = await dbHandler.addSocketToRoom(socketId, room.id);
      const res = addToRoom ? room.id : null;
      return res;
    } catch (error) {
      console.error('Error saving room AND/OR socket:', error);
      throw new Error('saving room AND/OR socket Error');
    }
  }

  // Add socket to a room. Return true if succesfull.
  static async addSocketToRoom(socketId, roomId) {
    try {
      const data = { socketId, roomId };
      const status = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/post/socketToRoom`,
        'POST',
        data,
      );
      return status.success;
    } catch (error) {
      console.error('Error adding new room:', error);
      throw new Error('add socket to room Error');
    }
  }

  static async getRoomByName(name) {
    try {
      const data = { name };
      console.log('grbn', data);
      const id = await dbHandler.fetchJSON(`${dbHandler.DOMAIN}/post/getRoomByName`, 'POST', data);
      return id;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw new Error('get room by name Error');
    }
  }

  // figure out type of entity
  static async solveTargetType(target) {
    try {
      const data = { target };
      const targetType = await dbHandler.fetchJSON(
        `${dbHandler.DOMAIN}/helper/identify`,
        'POST',
        data,
      );
      return targetType;
    } catch (error) {
      console.log('Unable to resolve target type: ', error);
      throw new Error('solveTarget Error');
    }
  }

  // Helper function for making fetch requests
  static async fetchJSON(url, method, data = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.error);
    }
    return res;
  }
}
