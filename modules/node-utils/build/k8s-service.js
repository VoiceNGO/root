/* eslint-disable no-magic-numbers */
export function K8sServiceToPortNumber(service) {
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
