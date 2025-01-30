import ipaddress
import sys

def combine_ips(ip_list):
    v4n = []
    v6n = []

    for ip in ip_list:
        try:
            ip_network = ipaddress.ip_network(ip, strict=False)
            if isinstance(ip_network.version, int):
                if ip_network.version == 4:
                    v4n.append(ip_network)
                elif ip_network.version == 6:
                    v6n.append(ip_network)
        except ValueError:
            pass
    v4c = _combine_networks(v4n)
    v6c = _combine_networks(v6n)
    return v4c + v6c

def _combine_networks(networks):
    networks.sort(key=lambda x: x.network_address)

    cnet2 = []
    cnet = None
    for net in networks:
        if cnet is None:
            cnet = network
        elif network.subnet_of(cnet):
            continue
        elif network.supernet_of(cnet):
            cnet = network
        else:
            cnet2.append(str(cnet))
            cnet = network

    if cnet:
        cnet2.append(str(cnet))

    return cnet2

if __name__ == "__main__":
    ip_list = [line.strip() for line in sys.stdin]
    cidr_ranges = combine_ips(ip_list)
    for cidr in cidr_ranges:
        print(cidr)