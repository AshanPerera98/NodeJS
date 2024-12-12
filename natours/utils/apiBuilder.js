// This builder class will be utilized to create a object that holds the query and by methods modifying it
class APIBuilder {
  constructor(query, queryString) {
    const { page, sort, limit, fields, ...queryParams } = queryString;

    this.query = query;

    this.page = page;
    this.sort = sort;
    this.limit = limit;
    this.fields = fields;
    this.queryParams = queryParams;
  }

  filtering() {
    const queryString = JSON.stringify(this.queryParams).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sorting() {
    if (this.sort) {
      this.query = this.query.sort(this.sort.split(',').join(' ')); // adding multiple sorting to gether with [space]
    } else {
      this.query = this.query.sort('-createdAt'); // default sorting
    }

    return this;
  }

  limiting() {
    if (this.fields) {
      this.query = this.query.select(this.fields.split(',').join(' ')); // selecting only requested fields
    } else {
      this.query = this.query.select('-__v'); // excluding fields by default
    }

    return this;
  }

  paginating() {
    if (this.page || this.limit) {
      const pageVal = Number(this.page) || 1;
      const limitVal = Number(this.limit) || 50;
      const skip = (pageVal - 1) * limitVal;

      this.query = this.query.skip(skip).limit(limitVal); // query for pagination and result limit
    }

    return this;
  }
}

module.exports = APIBuilder;
