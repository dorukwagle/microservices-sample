import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export function extractDeviceInfo(request: Request): string {
  const userAgent = request.headers['user-agent'] || '';
  const parser = new UAParser(userAgent);

  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  return (device.model ? `${device.vendor || ''} ${device.model} (${os.name || ''} ${os.version || ''})` : 
    `${browser.name || 'Browser'} on ${os.name || 'OS'}`).trim();
}
