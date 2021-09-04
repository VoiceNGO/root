# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: user.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import person_pb2 as person__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='user.proto',
  package='',
  syntax='proto2',
  serialized_pb=b'\n\nuser.proto\x1a\x0cperson.proto\"8\n\x04User\x12\x10\n\x08password\x18\x01 \x01(\t\x12\x14\n\x0cpasswordHash\x18\x02 \x01(\t*\x08\x08\x64\x10\x80\x80\x80\x80\x02:\x1c\n\x04user\x12\x07.Person\x18\x64 \x01(\x0b\x32\x05.User'
  ,
  dependencies=[person__pb2.DESCRIPTOR,])
_sym_db.RegisterFileDescriptor(DESCRIPTOR)


USER_FIELD_NUMBER = 100
user = _descriptor.FieldDescriptor(
  name='user', full_name='user', index=0,
  number=100, type=11, cpp_type=10, label=1,
  has_default_value=False, default_value=None,
  message_type=None, enum_type=None, containing_type=None,
  is_extension=True, extension_scope=None,
  options=None)


_USER = _descriptor.Descriptor(
  name='User',
  full_name='User',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='password', full_name='User.password', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='passwordHash', full_name='User.passwordHash', index=1,
      number=2, type=9, cpp_type=9, label=1,
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
  is_extendable=True,
  syntax='proto2',
  extension_ranges=[(100, 536870912), ],
  oneofs=[
  ],
  serialized_start=28,
  serialized_end=84,
)

DESCRIPTOR.message_types_by_name['User'] = _USER
DESCRIPTOR.extensions_by_name['user'] = user

User = _reflection.GeneratedProtocolMessageType('User', (_message.Message,), dict(
  DESCRIPTOR = _USER,
  __module__ = 'user_pb2'
  # @@protoc_insertion_point(class_scope:User)
  ))
_sym_db.RegisterMessage(User)

user.message_type = _USER
person__pb2.Person.RegisterExtension(user)

# @@protoc_insertion_point(module_scope)