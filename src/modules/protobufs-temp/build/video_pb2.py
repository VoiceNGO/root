# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: video.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import duration_pb2 as duration__pb2
from enums import codec_pb2 as enums_dot_codec__pb2
import file_pb2 as file__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='video.proto',
  package='',
  syntax='proto2',
  serialized_pb=b'\n\x0bvideo.proto\x1a\x0e\x64uration.proto\x1a\x11\x65nums/codec.proto\x1a\nfile.proto\"8\n\x05Video\x12\x19\n\x06length\x18\x01 \x01(\x0b\x32\t.Duration\x12\x14\n\x05\x66iles\x18\x0f \x03(\x0b\x32\x05.File\"e\n\x0cVideoDetails\x12\r\n\x05width\x18\x01 \x01(\x05\x12\x0e\n\x06height\x18\x02 \x01(\x05\x12\x1a\n\naudioCodec\x18\x03 \x01(\x0e\x32\x06.Codec\x12\x1a\n\nvideoCodec\x18\x04 \x01(\x0e\x32\x06.Codec:*\n\x0cvideoDetails\x12\x05.File\x18\x65 \x01(\x0b\x32\r.VideoDetails'
  ,
  dependencies=[duration__pb2.DESCRIPTOR,enums_dot_codec__pb2.DESCRIPTOR,file__pb2.DESCRIPTOR,])
_sym_db.RegisterFileDescriptor(DESCRIPTOR)


VIDEODETAILS_FIELD_NUMBER = 101
videoDetails = _descriptor.FieldDescriptor(
  name='videoDetails', full_name='videoDetails', index=0,
  number=101, type=11, cpp_type=10, label=1,
  has_default_value=False, default_value=None,
  message_type=None, enum_type=None, containing_type=None,
  is_extension=True, extension_scope=None,
  options=None)


_VIDEO = _descriptor.Descriptor(
  name='Video',
  full_name='Video',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='length', full_name='Video.length', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='files', full_name='Video.files', index=1,
      number=15, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
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
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=62,
  serialized_end=118,
)


_VIDEODETAILS = _descriptor.Descriptor(
  name='VideoDetails',
  full_name='VideoDetails',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='width', full_name='VideoDetails.width', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='height', full_name='VideoDetails.height', index=1,
      number=2, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='audioCodec', full_name='VideoDetails.audioCodec', index=2,
      number=3, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='videoCodec', full_name='VideoDetails.videoCodec', index=3,
      number=4, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
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
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=120,
  serialized_end=221,
)

_VIDEO.fields_by_name['length'].message_type = duration__pb2._DURATION
_VIDEO.fields_by_name['files'].message_type = file__pb2._FILE
_VIDEODETAILS.fields_by_name['audioCodec'].enum_type = enums_dot_codec__pb2._CODEC
_VIDEODETAILS.fields_by_name['videoCodec'].enum_type = enums_dot_codec__pb2._CODEC
DESCRIPTOR.message_types_by_name['Video'] = _VIDEO
DESCRIPTOR.message_types_by_name['VideoDetails'] = _VIDEODETAILS
DESCRIPTOR.extensions_by_name['videoDetails'] = videoDetails

Video = _reflection.GeneratedProtocolMessageType('Video', (_message.Message,), dict(
  DESCRIPTOR = _VIDEO,
  __module__ = 'video_pb2'
  # @@protoc_insertion_point(class_scope:Video)
  ))
_sym_db.RegisterMessage(Video)

VideoDetails = _reflection.GeneratedProtocolMessageType('VideoDetails', (_message.Message,), dict(
  DESCRIPTOR = _VIDEODETAILS,
  __module__ = 'video_pb2'
  # @@protoc_insertion_point(class_scope:VideoDetails)
  ))
_sym_db.RegisterMessage(VideoDetails)

videoDetails.message_type = _VIDEODETAILS
file__pb2.File.RegisterExtension(videoDetails)

# @@protoc_insertion_point(module_scope)
