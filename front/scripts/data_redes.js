export const redes = [
    {
        id: 1,
        rede: "192.168.1.0/24",
        descricao: "Rede Principal",
        ips: "15/254",
        status: "Capacidade crítica",
        statusClass: "status-warning"
    },
    {
        id: 2,
        rede: "10.0.0.0/24",
        descricao: "Servidores",
        ips: "50/254",
        status: "Normal",
        statusClass: "status-active"
    },
    {
        id: 3,
        rede: "172.16.1.0/24",
        descricao: "VLAN TI",
        ips: "200/254",
        status: "Normal",
        statusClass: "status-active"
    }
];