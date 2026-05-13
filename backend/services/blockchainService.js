const crypto = require('crypto');
const { TelemetryLog } = require('../models');

class BlockchainService {
  constructor() {
    this.secret = process.env.BLOCKCHAIN_SECRET || 'medicloud-blockchain-secret';
  }

  generateHash(data, previousHash) {
    const payload = `${JSON.stringify(data)}-${previousHash}-${this.secret}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  async verifyIntegrity(logId) {
    try {
      const log = await TelemetryLog.findById(logId);
      if (!log) return false;
      const expectedHash = this.generateHash({
        patientId: log.patientId,
        deviceId: log.deviceId,
        readings: log.readings,
        timestamp: log.timestamp
      }, log.previousHash);
      return expectedHash === log.dataHash;
    } catch (err) {
      console.error('Integrity check failed', err);
      return false;
    }
  }

  async getLatestHash() {
    const latestLog = await TelemetryLog.findOne().sort({ createdAt: -1 });
    return latestLog ? latestLog.dataHash : '0000000000000000000000000000000000000000000000000000000000000000';
  }
}

module.exports = new BlockchainService();
