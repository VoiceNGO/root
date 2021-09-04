# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: file.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import timestamp_pb2 as timestamp__pb2
import duration_pb2 as duration__pb2
import any_pb2 as any__pb2
from enums import file_type_pb2 as enums_dot_file__type__pb2
import server_pb2 as server__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='file.proto',
  package='',
  syntax='proto2',
  serialized_pb=b'\n\nfile.proto\x1a\x0ftimestamp.proto\x1a\x0e\x64uration.proto\x1a\tany.proto\x1a\x15\x65nums/file-type.proto\x1a\x0cserver.proto\"\xbb\x01\n\x04\x46ile\x12\n\n\x02id\x18\x01 \x01(\x05\x12\x0c\n\x04name\x18\x02 \x01(\t\x12\x1b\n\x08\x66ileType\x18\x03 \x01(\x0e\x32\t.FileType\x12\x1b\n\x07\x63reated\x18\x04 \x01(\x0b\x32\n.Timestamp\x12\x1b\n\x07\x65xpires\x18\x05 \x01(\x0b\x32\n.Timestamp\x12\x0e\n\x06public\x18\x06 \x01(\x08\x12\x17\n\x06server\x18\x07 \x01(\x0b\x32\x07.Server\x12\x0f\n\x07md5hash\x18\x08 \x01(\t*\x08\x08\x64\x10\x80\x80\x80\x80\x02'
  ,
  dependencies=[timestamp__pb2.DESCRIPTOR,duration__pb2.DESCRIPTOR,any__pb2.DESCRIPTOR,enums_dot_file__type__pb2.DESCRIPTOR,server__pb2.DESCRIPTOR,])
_sym_db.RegisterFileDescriptor(DESCRIPTOR)




_FILE = _descriptor.Descriptor(
  name='File',
  full_name='File',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='id', full_name='File.id', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='name', full_name='File.name', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='fileType', full_name='File.fileType', index=2,
      number=3, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='created', full_name='File.created', index=3,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='expires', full_name='File.expires', index=4,
      number=5, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='public', full_name='File.public', index=5,
      number=6, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='server', full_name='File.server', index=6,
      number=7, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='md5hash', full_name='File.md5hash', index=7,
      number=8, type=9, cpp_type=9, label=1,
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
  serialized_start=96,
  serialized_end=283,
)

_FILE.fields_by_name['fileType'].enum_type = enums_dot_file__type__pb2._FILETYPE
_FILE.fields_by_name['created'].message_type = timestamp__pb2._TIMESTAMP
_FILE.fields_by_name['expires'].message_type = timestamp__pb2._TIMESTAMP
_FILE.fields_by_name['server'].message_type = server__pb2._SERVER
DESCRIPTOR.message_types_by_name['File'] = _FILE

File = _reflection.GeneratedProtocolMessageType('File', (_message.Message,), dict(
  DESCRIPTOR = _FILE,
  __module__ = 'file_pb2'
  # @@protoc_insertion_point(class_scope:File)
  ))
_sym_db.RegisterMessage(File)


# @@protoc_insertion_point(module_scope)
