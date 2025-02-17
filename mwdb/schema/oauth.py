from marshmallow import Schema, fields


class OpenIDProviderCreateRequestSchema(Schema):
    name = fields.Str(required=True, allow_none=False)
    client_id = fields.Str(required=True, allow_none=False)
    client_secret = fields.Str(required=True, allow_none=True)
    authorization_endpoint = fields.Str(required=True, allow_none=False)
    token_endpoint = fields.Str(required=True, allow_none=False)
    userinfo_endpoint = fields.Str(required=True, allow_none=False)
    jwks_endpoint = fields.Str(required=True, allow_none=True)


class OpenIDAuthorizeRequestSchema(Schema):
    code = fields.Str(required=True, allow_none=False)
    state = fields.Str(required=True, allow_none=False)
    nonce = fields.Str(required=True, allow_none=False)


class OpenIDProviderListResponseSchema(Schema):
    providers = fields.List(fields.Str(), required=True, allow_none=False)


class OpenIDLoginResponseSchema(Schema):
    authorization_url = fields.Str(required=True, allow_none=False)
    state = fields.Str(required=True, allow_none=False)
    nonce = fields.Str(required=True, allow_none=False)
