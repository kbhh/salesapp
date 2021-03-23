import CrudService from '../lib/crud';

class ProductService extends CrudService {
  constructor(model) {
    super(model);
  }
};

export default ProductService;