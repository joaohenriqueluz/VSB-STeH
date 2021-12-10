import socket
import osc_decoder
import asyncio
import websockets
import json

# from flask import Flask, jsonify, request, Response
# from flask_socketio import *
# from flask_cors import CORS
# from settings import *
# import sys
# import logging
# import threading
# import time
# import random
# import datetime


# SocketIO 
# socketio = SocketIO(app, cors_allowed_origins="*")
# Create a UDP socket at client side
UDPClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
#binding
UDPClientSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
UDPClientSocket.bind(("192.168.137.1", 8239))

async def handler(websocket, path):
    while True:
        try:
            msgFromServer, addr = UDPClientSocket.recvfrom(4002)
            # print(sys.getsizeof(msgFromServer))
            await websocket.send(json.dumps(osc_decoder.decode(msgFromServer)))
        except socket.error as e:
            print(e)
            pass
        # else:
            # for message in osc_decoder.decode(msgFromServer):
            #     print(UDPClientSocket.getsockname(), message)
            # await websocket.send(json.dumps(osc_decoder.decode(msgFromServer)))
            # await asyncio.sleep(1)

if __name__ == '__main__':
    # socketio.run(app, debug=True)
    start_server = websockets.serve(handler, "127.0.0.1", 8888)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
        

