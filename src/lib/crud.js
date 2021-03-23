import messages from "./messages.json";

class Crud {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    try {
      const record = new this.model(data);
      await record.save();
      if (record)
        return {
          error: false,
          statusCode: 201,
          message: messages.success.created,
          record,
        };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: err.message || messages.error.created,
      };
    }
  }
  async update(id, data) {
    try {
      const record = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      return {
        error: false,
        statusCode: 202,
        message: messages.success.updated,
        record,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: err.errormsg || messages.error.updated,
        err,
      };
    }
  }
  async updateMany(filter, updateData) {
    try {
      const record = await this.model.updateMany(filter, updateData);
      return {
        error: false,
        statusCode: 202,
        message: messages.success.updated,
        record,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: err.errormsg || messages.error.updated,
        err,
      };
    }
  }
  async updateByAddSet(id, data) {
    try {
      let record = await this.model.findByIdAndUpdate(
        id,
        { $addToSet: data },
        { new: true }
      );
      return {
        error: false,
        statusCode: 202,
        message: messages.success.updated,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: err.errormsg || messages.error.updated,
        error,
      };
    }
  }
  async addByPush(condition, data, select) {
    try {
      const record = await this.model.updateOne(
        condition,
        { $push: data },
        {
          upsert: true,
        },
        select
      );
      return {
        error: false,
        statusCode: 200,
        message: messages.success.updated,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: err.errormsg || messages.error.updated,
      };
    }
  }
  async updateBySet(query, data, select) {
    try {
      let record = await this.model.updateOne(query, { $set: data }, select);
      return {
        error: false,
        statusCode: 202,
        message: messages.success.updated,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: err.errormsg || messages.error.updated,
      };
    }
  }
  async remove(id) {
    try {
      let record = await this.model.findByIdAndDelete(id);
      if (record)
        return {
          error: false,
          message: messages.success.deleted,
          statusCode: 202,
          record,
        };

      return {
        error: true,
        statusCode: 500,
        message: messages.error.deleted,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        err,
      };
    }
  }
  async getById(id, selectedfileds) {
    try {
      // let record = await this.model.findById(id).select(selectedfileds).populate(populateparam, populateData);
      let record = await this.model.findById(id).select(selectedfileds);
      if (record)
        return {
          error: false,
          message: messages.success.retrieved,
          statusCode: 202,
          record,
        };
      return {
        error: true,
        statusCode: 404,
        message: "record not found",
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: messages.error.retrieved,
      };
    }
  }
  async getAll(req, selectedfileds) {
    try {
      let record = await this.model.find({}).select(selectedfileds);
      if (record)
        return {
          error: false,
          message: messages.success.retrieved,
          statusCode: 202,
          record,
        };
      return {
        error: true,
        statusCode: 404,
        message: messages.error.retrieved,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        err,
      };
    }
  }
  async getOne(param, selectedfileds) {
    try {
      let record = await this.model.findOne(param).select(selectedfileds);
      if (record)
        return {
          error: false,
          statusCode: 202,
          message: messages.success.retrieved,
          record,
        };
      return {
        error: true,
        statusCode: 404,
        message: messages.error.retrieved,
        record,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: err,
      };
    }
  }
  async getByField(param, selectedfileds) {
    try {
      let record = await this.model.find(param).select(selectedfileds);
      if (record != "") {
        return {
          error: false,
          statusCode: 201,
          message: messages.success.retrieved,
          record,
        };
      }
      return {
        error: true,
        statusCode: 404,
        message: messages.error.retrieved,
        record,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: err,
      };
    }
  }
  async getByAgregate(query) {
    try {
      let record = await this.model.aggregate(query);
      if (record != "") {
        return {
          error: false,
          statusCode: 201,
          message: messages.success.retrieved,
          record,
        };
      }
      return {
        error: true,
        statusCode: 404,
        message: messages.error.retrieved,
        record,
      };
    } catch (err) {
      return {
        error: true,
        statusCode: 500,
        message: err,
      };
    }
  }
}

export default Crud;
