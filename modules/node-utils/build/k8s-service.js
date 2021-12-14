"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.K8sServiceToPortNumber = void 0;
/* eslint-disable no-magic-numbers */
function K8sServiceToPortNumber(service) {
    switch (service) {
        case 'HTTP':
            return 80;
        case 'HTTPS':
            return 442;
        case 'POSTGRESSQL':
            return 5432;
        case 'REDIS':
            return 6379;
    }
}
exports.K8sServiceToPortNumber = K8sServiceToPortNumber;
