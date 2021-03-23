class Controller {
  constructor(service) {
    this.service = service;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.remove = this.remove.bind(this);
  }

  async create(req, res) {
    req.body.log = { actor: req.log.actor, activity: req.log.activity };
    let result = await this.service.create(req.body);
    return res.status(result.statusCode).send(result);
  }
  async update(req, res) {
    const { id } = req.params;
    let result = await this.service.update(id, req.body);
    await this.service.updateByAddSet(id, {
      log: { actor: req.log.actor, activity: req.log.activity, id: req.log.id },
    });
    return res.status(result.statusCode).send(result);
  }
  async remove(req, res) {
    let id = req.params.id;
    let result = await this.service.remove(id);
    return res.status(result.statusCode).send(result);
  }

  async getAll(req, res) {
    let result = await this.service.getAll("", { log: 0 });
    return res.status(result.statusCode).send(result);
  }
  async getById(req, res) {
    let id = req.params.id;
    let result = await this.service.getById(id);
    return res.status(result.statusCode).send(result);
  }
}

export default Controller;
