/*
 * SPDX-License-Identifier: Apache-2.0
 */

import pino from 'pino';
import * as config from '../../../../../RE-Project/fabric-samples/asset-transfer-basic/rest-api-typescript/src/config';

export const logger = pino({
  level: config.logLevel,
});
