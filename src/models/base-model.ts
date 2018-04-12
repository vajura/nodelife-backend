import * as mongoose from 'mongoose';

export const BaseSchema: mongoose.Schema = new mongoose.Schema({
  dataInfo: Object,
  deleted: Object
});

export function extendBaseSchema(schema: mongoose.Schema, options: any = {}) {
  return new mongoose.Schema(
    Object.assign({}, BaseSchema.obj, schema.obj),
    options
  );
}
