class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  cursorPaginate() {
    // Get parameters from query string
    const limit = this.queryString.limit * 1 || 20;
    const cursor = this.queryString.cursor; // This should be the ID of the last item in previous batch
    const sortField = this.queryString.sort || "_id";
    const direction = this.queryString.direction === "prev" ? -1 : 1; // Default to 'next'

    // Handle sort field direction
    const sortDirection = sortField.startsWith("-") ? -1 : 1;
    const cleanSortField = sortField.startsWith("-")
      ? sortField.slice(1)
      : sortField;

    // Build the query
    if (cursor) {
      // Create the appropriate comparison operator based on direction
      const compareOp = direction * sortDirection === 1 ? "$gt" : "$lt";

      // If we have a cursor, filter by it
      // We need to get the cursor value from the document with that ID
      this.query = this.query.find({
        [cleanSortField]: { [compareOp]: cursor },
      });
    }

    // Apply the sort
    const effectiveSortDirection = sortDirection * direction;
    this.query = this.query.sort({ [cleanSortField]: effectiveSortDirection });

    // Apply the limit
    this.query = this.query.limit(limit + 1); // +1 to check if there are more results

    return this;
  }
}
export default APIFeatures;
