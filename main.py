from datetime import datetime
from fastapi import Depends, FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi.responses import JSONResponse
import uvicorn
import requests
import config
from functools import lru_cache
from services.custos_service import CustosAPI

# ENVIRONMENT VARIABLES
@lru_cache()
def get_settings():
    return config.Settings()

admin_user_name = get_settings().ADMIN_USER
admin_password = get_settings().ADMIN_PASS

# Custos API Initialization
custos_api = CustosAPI(admin_user_name, admin_password)

middleware = [Middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], )
]

app = FastAPI()
app = FastAPI(middleware=middleware)

# EXCEPTION HANDLER
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception:
        return Response("Internal server error", status_code=500)

app.middleware('http')(catch_exceptions_middleware)

# MAIN ENDPOINT 
@app.get("/")
def main_page():
    return "CUSTOS CLIENT"

# ===============================================================================================
@app.post("/verifyUser")
async def verifyUser(info: Request):
    req_data = await info.json()
    print(req_data)
    try:
        resp = await custos_api.verifiy_user(req_data["admin_user_name"],req_data["admin_password"])
        print("Successfully verified user")
        return JSONResponse({"success": "true", "message": "Successfully verified user"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/registerUsers")
async def registerUsers(info: Request):
    req_data = await info.json()
    print(req_data)
    try:
        await custos_api.register_users(req_data['users'])
        return JSONResponse({"success": "true"}, 200)
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/createGroups")
async def createGroups(info: Request):
    req_data = await info.json()
    try:
        custos_api.create_groups(req_data['groups'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/allocateUsersToGroups")
async def allocateUsersToGroups(info: Request):
    req_data = await info.json()
    try:
        resp = custos_api.allocate_users_to_groups(req_data['user_group_mapping'])
        return JSONResponse(resp)
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/allocateChildGroupToParentGroup")
async def allocateChildToParent(info: Request):
    req_data = await info.json()
    try:
        custos_api.allocate_child_group_to_parent_group(
            req_data["child_gr_parent_gr_mapping"])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/createPermission")
async def createPermission(info: Request):
    req_data = await info.json()
    try:
        custos_api.create_permissions(req_data['permissions'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/createEntityType")
async def createEntityType(info: Request):
    req_data = await info.json()
    try:
        custos_api.create_entity_types(req_data['entity_types'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/registerResources")
async def registerResources(info: Request):
    req_data = await info.json()
    try:
        custos_api.register_resources(req_data['resources'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/shareResourceWithGroup")
async def shareResourceWithGroup(info: Request):
    req_data = await info.json()
    try:
        custos_api.share_resource_with_group(req_data['gr_sharings'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/shareResourceWithUser")
async def shareResourceWithUser(info: Request):
    req_data = await info.json()
    try:
        custos_api.share_resource_with_user(req_data['sharings'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/checkUserPermission")
async def checkUserPermission(info: Request):
    req_data = await info.json()
    try:
        custos_api.check_user_permissions(req_data['users'])
        return JSONResponse({"success": "true"})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)


# ===============================================================================================
@app.post("/generateSSHKey")
async def createSSH(info: Request):
    req_data = await info.json()
    try:
        token = await custos_api.generate_SSH_key(req_data['user_id'], req_data['description'])
        return JSONResponse({"success": "true", "token": token})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)

# ===============================================================================================
@app.post("/getSSHKey")
async def getSSH(info: Request):
    req_data = await info.json()
    print(req_data)
    try:
        val = await custos_api.get_SSH_key(req_data["token"])
        return JSONResponse({"success": "true", "data": val})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)

# ===============================================================================================
@app.post("/addPasswordCredential")
async def addPasswordCredential(info: Request):
    req_data = await info.json()
    try:
        token = await custos_api.add_password_credential(req_data['user_id'], req_data['description'], req_data['password'])
        return JSONResponse({"success": "true", "token": token})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)

# ===============================================================================================
@app.post("/getPasswordCredential")
async def getPasswordCredential(info: Request):
    req_data = await info.json()
    print(req_data)
    try:
        val = await custos_api.get_password_credential(req_data["token"])
        return JSONResponse({"success": "true", "data": val})
    except Exception as e:
        print("Something went wrong\n",e)
        return JSONResponse({"success": "false"}, 500)

# ===============================================================================================
def start():
    print('CUSTOS CLIENT SERVICE STARTED')
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ===============================================================================================
if __name__ == '__main__':
    start()