class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    /**
    @desc    filter by fields
    @usage   use this method in controller to filter by fields and operators ($gt, $gte, $lt, $lte, $eq) are supported
    @return  this
    */
    filterByField() {
        // filtering
        // create copy of req.query object
        const queryStringFilterObject = {...this.queryString};
        // remove fields not related with filtering from queryStringFilterObject
        const removeFields = ['select', 'sort', 'page', 'limit', "keyword"];
        removeFields.forEach((field) => delete queryStringFilterObject[field]);

        // advanced filtering with operators ($gt, $gte, $lt, $lte, $eq)
        const queryStringAdvancedFilterObject = JSON.parse(
            JSON.stringify(queryStringFilterObject)
                // replace gte, gt, lte, lt with $gte, $gt, $lte, $lt
                .replace(/\b(gt|gte|lt|lte|eq)\b/g, match => `$${match}`)
        );

        this.mongooseQuery.find(queryStringAdvancedFilterObject);

        return this;
    }

    /**
     * @desc    sorting by fields
     * @usage   use this method in controller to sorting by fields (ascending "default" or descending "-") and default sorting by createdAt field
     * @return  this
     */
    sortingByFields() {
        const {sort} = this.queryString;
        // sorting (ascending or descending) by fields
        if (sort) {
            // replace , with space
            const sortBy = sort.replace(/,/g, ' ');
            this.mongooseQuery.sort(sortBy);
        }
        // default sorting by createdAt field
        else
            this.mongooseQuery.sort('-createdAt');

        return this;
    }

    /**
     * @desc    pagination
     * @usage   use this method in controller to pagination
     * @return  this
     */
    pagination() {
        // pagination
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 5;
        const skip = (page - 1) * limit;
        this.mongooseQuery.skip(skip).limit(limit);
        // if page is greater than total pages
        return this;
    }

    /**
     * @desc    select fields to return (default select all fields except __v)
     * @usage   use this method in controller to select fields to return
     * @return  this
     */
    selectFields() {
        const {select} = this.queryString;
        // select fields to return
        if (select) {
            // replace , with space
            const fields = select.replace(/,/g, ' ');
            this.mongooseQuery.select(fields);
        }
        // default select all fields except __v
        else
            this.mongooseQuery.select('-__v');

        return this;
    }

    /**
     * @desc    search with keyword in title and description fields with case-insensitive using regex
     * @usage   use this method in controller to search with keyword in title and description fields with case-insensitive using regex
     * @return  this
     */
    searchWithKeyword() {
        const {keyword} = this.queryString;
        // search with keyword in title and description fields with case-insensitive using regex
        if (keyword) {
            const keywordSearchObject = {
                $or: [
                    {title: {$regex: keyword, $options: 'i'}},
                    {description: {$regex: keyword, $options: 'i'}},
                ]
            };
            this.mongooseQuery.find(keywordSearchObject);
        }
        return this;
    }
}

module.exports = ApiFeatures;