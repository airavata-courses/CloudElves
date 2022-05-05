import json
import random, string
from custos.clients.user_management_client import UserManagementClient
from custos.clients.group_management_client import GroupManagementClient
from custos.clients.resource_secret_management_client import ResourceSecretManagementClient
from custos.clients.sharing_management_client import SharingManagementClient
from custos.clients.identity_management_client import IdentityManagementClient
from custos.transport.settings import CustosServerClientSettings
import custos.clients.utils.utilities as utl
from google.protobuf.json_format import MessageToJson
import config
from functools import lru_cache

# ENVIRONMENT VARIABLES
@lru_cache()
def get_settings():
    return config.Settings()

CUSTOS_HOST = get_settings().CUSTOS_HOST
CUSTOS_PORT = get_settings().CUSTOS_PORT
CUSTOS_CLIENT_ID = get_settings().CUSTOS_CLIENT_ID
CUSTOS_CLIENT_SECRET = get_settings().CUSTOS_CLIENT_SECRET

class CustosAPI:
    def __init__(self, admin_username, admin_password):
        # read settings
        self.custos_settings = CustosServerClientSettings(custos_host=CUSTOS_HOST,
                  custos_port=CUSTOS_PORT,
                  custos_client_id=CUSTOS_CLIENT_ID,
                  custos_client_sec=CUSTOS_CLIENT_SECRET
                  )
        # create custos user management client
        self.user_management_client = UserManagementClient(self.custos_settings)
        # create custos group management client
        self.group_management_client = GroupManagementClient(self.custos_settings)
        # create custos resource secret client
        self.resource_secret_client = ResourceSecretManagementClient(self.custos_settings)
        # create sharing management client
        self.sharing_management_client = SharingManagementClient(self.custos_settings)
        # create identity management client
        self.identity_management_client = IdentityManagementClient(self.custos_settings)
        # obtain base 64 encoded token for tenant
        self.b64_encoded_custos_token = utl.get_token(custos_settings=self.custos_settings)
        self.created_groups = {}
        self.admin_user_name = admin_username
        self.admin_password = admin_password
        self.resource_ids = []
        print('Successfully configured all custos clients')

    def verify_user(self, login_user_id, login_user_password):
        print("Login user " + login_user_id)
        login_reponse = self.identity_management_client.token(token=self.b64_encoded_custos_token, username=login_user_id, password=login_user_password, grant_type='password')
        login_reponse = MessageToJson(login_reponse)
        print("Login response: ", login_reponse)
        response = self.user_management_client.get_user(token=self.b64_encoded_custos_token, username=login_user_id)
        print(" Updating user profile...  ")
        self.user_management_client.update_user_profile(
            token=self.b64_encoded_custos_token,
            username=response.username,
            email=response.email,
            first_name=response.first_name,
            last_name=response.last_name)
        print(" User  " + login_user_id + " successfully logged in and updated profile")
        return response

    def register_users(self, users):
        for user in users:
            print("Registering user: " + user['username'])
            try:
                self.user_management_client.register_user(token=self.b64_encoded_custos_token,
                                                username=user['username'],
                                                first_name=user["first_name"],
                                                last_name=user['last_name'],
                                                password=user['password'],
                                                email=user['email'],
                                                is_temp_password=False)
                self.enable_user(user['username'])
            except Exception:
                print("User may already exist")
        return None

    def get_user(self, username):
        response = self.user_management_client.get_user(token=self.b64_encoded_custos_token, username=username)
        return response

    def enable_user(self, username):
        response = self.user_management_client.enable_user(token=self.b64_encoded_custos_token, username=username)
        return response

    def create_groups(self, groups):
        for group in groups:
            try:
                print("Creating group: " + group['name'])
                grResponse = self.group_management_client.create_group(
                    token=self.b64_encoded_custos_token,
                    name=group['name'],
                    description=group['description'],
                    owner_id=group['owner_id'])
                resp = MessageToJson(grResponse)
                print(resp)
                respData = json.loads(resp)
                print('Created group id of '+ group['name'] + ': ' +respData['id'] )
                self.created_groups[respData['name']] = respData['id']
            except Exception as e:
                print("Group may already exist\n",e)
        return None
        
    def allocate_users_to_groups(self, user_group_mapping):
        for usr_map in user_group_mapping:
            try:
                group_id = self.created_groups[usr_map['group_name']]
                print('Assigning user ' + usr_map['username'] + ' to group ' + usr_map['group_name'])
                val = self.group_management_client.add_user_to_group(token=self.b64_encoded_custos_token,
                                                            username=usr_map['username'],
                                                            group_id=group_id,
                                                            membership_type='Member')
                resp = MessageToJson(val)
                print(resp)
            except Exception as e:
                print("User allocation error\n",e)
        return None

    def allocate_child_group_to_parent_group(self, gr_gr_mapping):
        for gr_map in gr_gr_mapping:
            try:
                child_id = self.created_groups[gr_map['child_name']]
                parent_id = self.created_groups[gr_map['parent_name']]
                print('Assigning child group ' + gr_map['child_name'] + ' to parent group ' + gr_map['parent_name'])
                self.group_management_client.add_child_group(
                    token=self.b64_encoded_custos_token,
                    parent_group_id=parent_id,
                    child_group_id=child_id)
            except Exception as e:
                print("Child group allocation error\n",e)
        return None
    
    def create_permissions(self, permissions):
        for perm in permissions:
            try:
                self.sharing_management_client.create_permission_type(token=self.b64_encoded_custos_token,
                                                            client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                            id=perm['id'],
                                                            name=perm['name'],
                                                            description=perm['description'])
            except Exception as e:
                print("Permission creation errror\n",e)
        return None
    
    def create_entity_types(self, entity_types):
        for type in entity_types:
            try:
                self.sharing_management_client.create_entity_type(token=self.b64_encoded_custos_token,
                                                        client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                        id=type['id'],
                                                        name=type['name'],
                                                        description=type['description'])
            except Exception as e:
                print("Entity type creation error\n",e)
        return None

    def register_resources(self, resources):
        for resource in resources:
            try:
                id =  resource['name'].join(random.choice(string.ascii_letters) for x in range(5))
                self.resource_ids.append(id)
                resource['id']=id
                print('Register resources ' + resource['name'] + ' generated ID : '+resource['id'] )
                self.sharing_management_client.create_entity(token=self.b64_encoded_custos_token,
                                                        client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                        id=resource['id'],
                                                        name=resource['name'],
                                                        description=resource['description'],
                                                        owner_id=resource['user_id'],
                                                        type=resource['type'],
                                                        parent_id='')
            except Exception as e:
                print("Resource registration error\n",e)
        return None

    def share_resource_with_group(self, gr_sharings):
        for shr in gr_sharings:
            try:
                group_id = self.created_groups[shr['group_name']]
                print('Sharing entity ' + shr['entity_id'] + ' with group ' + shr['group_name'] + ' with permission ' + shr['permission_type'])
                self.sharing_management_client.share_entity_with_groups(token=self.b64_encoded_custos_token,
                                                                client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                                entity_id=shr['entity_id'],
                                                                permission_type=shr['permission_type'],
                                                                group_id=group_id)
            except Exception as e:
                print("Resource already shared:\n",e)
        return None

    def share_resource_with_user(self, sharings):
        for shr in sharings:
            try:
                print('Sharing entity ' + shr['entity_id'] + ' with user ' + shr['user_id'] + ' with permission ' + shr['permission_type'])
                self.sharing_management_client.share_entity_with_users(token=self.b64_encoded_custos_token,
                                                                client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                                entity_id=shr['entity_id'],
                                                                permission_type=shr['permission_type'],
                                                                user_id=shr['user_id']
                                                                )
            except Exception as e:
                print("Resource already shared\n",e)
        return None

    def check_user_permissions(self, users):
        accesses = {}
        for user in users:
            try:
                access = self.sharing_management_client.user_has_access(token=self.b64_encoded_custos_token,
                                                                client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                                entity_id=self.resource_ids[0],
                                                                permission_type='READ',
                                                                user_id=user["username"])
                accesses[user["username"]] = access
                print(f'Access for user {user["username"]}: {access}')
            except Exception as e:
                print("Error while checking permissions for user\n",e)
        return f'Users have access: {accesses}'

    def generate_SSH_key(self, user_id, description):
        try:
            response = self.resource_secret_client.add_ssh_credential(token=self.b64_encoded_custos_token, 
                                                                    client_id=self.custos_settings.CUSTOS_CLIENT_ID, 
                                                                    owner_id=user_id, 
                                                                    description=description)
            return response.token
        except Exception as e:
            print(f"Error while creating SSH key for user {user_id}\n",e)

    def get_SSH_key(self, ssh_credential_token):
        try:
            return self.resource_secret_client.get_ssh_credential(token=self.b64_encoded_custos_token, 
                                                                client_id=self.custos_settings.CUSTOS_CLIENT_ID, 
                                                                ssh_credential_token=ssh_credential_token)
        except Exception as e:
            print(f"Error while retrieving SSH key for user\n",e)

    def add_password_credential(self, owner_id, description, password):
        try:
            response = self.resource_secret_client.add_password_credential(token=self.b64_encoded_custos_token,
                                                                  client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                                  owner_id=owner_id,
                                                                  description=description,
                                                                  password=password)
            return response.token
        except Exception as e:
            print(f"Error while adding password credential for user {owner_id}\n",e)
    
    def get_password_credential(self, password_credential_token):
        try:
            response = self.resource_secret_client.get_password_credential(token=self.b64_encoded_custos_token,
                                                                  client_id=self.custos_settings.CUSTOS_CLIENT_ID,
                                                                  password_credential_token=password_credential_token)
            return response                                                      
        except Exception as e:
            print(f"Error while retrieving password credential for user\n",e)