# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: token.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='token.proto',
  package='',
  syntax='proto3',
  serialized_pb=b'\n\x0btoken.proto\"\x07\n\x05Token\"H\n\nPermission\x12\x0f\n\x07service\x18\x01 \x01(\t\x12\x0c\n\x04\x64\x61ta\x18\x02 \x01(\t\x12\x0c\n\x04read\x18\x0e \x01(\x08\x12\r\n\x05write\x18\x0f \x01(\x08\"\x1d\n\x0ctokenRequest\x12\r\n\x05token\x18\x01 \x01(\tb\x06proto3'
)
_sym_db.RegisterFileDescriptor(DESCRIPTOR)




_TOKEN = _descriptor.Descriptor(
  name='Token',
  full_name='Token',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=15,
  serialized_end=22,
)


_PERMISSION = _descriptor.Descriptor(
  name='Permission',
  full_name='Permission',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='service', full_name='Permission.service', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='data', full_name='Permission.data', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='read', full_name='Permission.read', index=2,
      number=14, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='write', full_name='Permission.write', index=3,
      number=15, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=24,
  serialized_end=96,
)


_TOKENREQUEST = _descriptor.Descriptor(
  name='tokenRequest',
  full_name='tokenRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='token', full_name='tokenRequest.token', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=98,
  serialized_end=127,
)

DESCRIPTOR.message_types_by_name['Token'] = _TOKEN
DESCRIPTOR.message_types_by_name['Permission'] = _PERMISSION
DESCRIPTOR.message_types_by_name['tokenRequest'] = _TOKENREQUEST

Token = _reflection.GeneratedProtocolMessageType('Token', (_message.Message,), dict(
  DESCRIPTOR = _TOKEN,
  __module__ = 'token_pb2'
  # @@protoc_insertion_point(class_scope:Token)
  ))
_sym_db.RegisterMessage(Token)

Permission = _reflection.GeneratedProtocolMessageType('Permission', (_message.Message,), dict(
  DESCRIPTOR = _PERMISSION,
  __module__ = 'token_pb2'
  # @@protoc_insertion_point(class_scope:Permission)
  ))
_sym_db.RegisterMessage(Permission)

tokenRequest = _reflection.GeneratedProtocolMessageType('tokenRequest', (_message.Message,), dict(
  DESCRIPTOR = _TOKENREQUEST,
  __module__ = 'token_pb2'
  # @@protoc_insertion_point(class_scope:tokenRequest)
  ))
_sym_db.RegisterMessage(tokenRequest)


# @@protoc_insertion_point(module_scope)