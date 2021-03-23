const _jwt = require("jsonwebtoken");
const config = require("../Config/config");
import mongoose from "mongoose";

// define ur tasks/functions here that you will use common for most of the models

class Service {
  constructor(model) {
    this.model = model;
  }
  async getOne(param, selectedfileds) {
    try {
      let record = await this.model.findOne(param, selectedfileds);
      if (record)
        return {
          error: false,
          message: messages.success.retrieved,
          statusCode: 202,
          record,
        };
      return {
        err: true,
        statusCode: 404,
        message: "No record",
      };
    } catch (err) {
      return {
        err: true,
        statusCode: 500,
        err,
      };
    }
  }
  async getById(id, selectedfileds) {
    try {
      let record = await this.model.findById(id, selectedfileds);
      if (record != "")
        return {
          err: false,
          found: true,
          statusCode: 201,
          record: record,
        };
      return {
        err: true,
        statusCode: 200,
        message: "No record",
        record: null,
      };
    } catch (err) {
      return {
        err: true,
        statusCode: 500,
        message: err,
        record: null,
      };
    }
  }
  async getByField(param, selectedfileds) {
    try {
      let record = await this.model.find(param, selectedfileds);
      if (record != "")
        return {
          error: false,
          message: messages.success.retrieved,
          statusCode: 201,
          record,
        };
      return {
        err: true,
        statusCode: 200,
        message: "No record",
        record: null,
      };
    } catch (err) {
      return {
        err: true,
        statusCode: 500,
        message: err,
        record: null,
      };
    }
  }
  async getAll(query) {
    let { skip, limit } = query;

    skip = skip ? Number(skip) : 0;
    limit = limit ? Number(limit) : 10;

    delete query.skip;
    delete query.limit;

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id);
      } catch (error) {
        console.log("not able to generate mongoose id with content", query._id);
      }
    }

    try {
      let items = await this.model.find(query).skip(skip).limit(limit);
      let total = await this.model.count();

      return {
        error: false,
        statusCode: 200,
        data: items,
        total,
      };
    } catch (errors) {
      return {
        error: true,
        statusCode: 500,
        errors,
      };
    }
  }

  async insert(data) {
    try {
      let record = await this.model.create(data);
      if (record)
        return {
          error: false,
          statusCode: 201,
          record,
        };
    } catch (error) {
      console.log("error", error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors,
      };
    }
  }
  async addByPush(condition, data, select) {
    try {
      const record = await this.model.updateOne(
        condition,
        { $push: data },
        select
      );
      console.log(record);
      return {
        error: false,
        statusCode: 200,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
  async update(id, data, filters) {
    try {
      let record = await this.model.updateOne({ _id: id }, data, {
        upsert: true,
      });
      return {
        error: false,
        statusCode: 202,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
  async updateOne(query, data) {
    try {
      let record = await this.model.updateOne(query, data, { upsert: true });
      return {
        error: false,
        statusCode: 202,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
  async updateByAddSet(query, data) {
    try {
      let record = await this.model.updateOne(
        query,
        { $addToSet: data },
        { upsert: true }
      );

      return {
        error: false,
        statusCode: 202,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
  async updateBySet(query, data, select) {
    try {
      let record = await this.model.updateOne(query, { $set: data }, select);
      return {
        error: false,
        statusCode: 202,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
  async deleteByPull(condition, data, select) {
    try {
      const record = await this.model.updateOne(
        condition,
        { $pull: data },
        select
      );
      return {
        error: false,
        statusCode: 200,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
  async delete(id) {
    try {
      let record = await this.model.findByIdAndDelete(id);
      if (!record)
        return {
          error: true,
          statusCode: 404,
          message: "item not found",
        };

      return {
        error: false,
        deleted: true,
        statusCode: 202,
        record,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error,
      };
    }
  }
}

export default Service;
