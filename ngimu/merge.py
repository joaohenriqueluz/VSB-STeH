import socket
import osc_decoder
import asyncio
import websockets
import json

# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤
# Inputs
udp_port = 8239     # Same as UDP send port in NGIMU settings
ws_port = 8888
# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤

# Create a UDP socket at client side
UDPClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
# binding
UDPClientSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
UDPClientSocket.bind(("", udp_port))


async def handler(websocket, path):
    while True:
        try:
            msgFromServer, addr = UDPClientSocket.recvfrom(1024)

            # Everything was ok with this code, the threading it self is not required I guess
            await websocket.send(json.dumps(osc_decoder.decode(msgFromServer)))

            # This right here was the problem, if not called to sleep, data would buffer up and only send in batch
            await asyncio.sleep(0)

        except socket.error as e:
            print(e)
        pass

if __name__ == '__main__':
    start_server = websockets.serve(handler, "127.0.0.1", ws_port)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()