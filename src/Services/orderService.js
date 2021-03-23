import CrudService from '../lib/crud';

class OrderService extends CrudService {
  constructor(model) {
    super(model);
  }
};

export default OrderService;