/**
 * @desc    ApiFeatures class to filter, sort, paginate, select fields to return, search with keyword in title and description fields with case-insensitive using regex
 * @since   monday 26 Jun 2023
 * @example const apiFeatures = new ApiFeatures(mongooseQuery, queryString);
 */
class ApiFeatures {
    /**
     * @desc    constructor
     * @constructor ApiFeatures
     * @param   {Query} mongooseQuery - The mongoose query object
     * @param   {object} queryString - The query string object
     */
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    /**
    @desc    filter by fields
    @usage   use this method in controller to filter by fields and operators ($gt, $gte, $lt, $lte, $eq) are supported
    @return  this
    @since  monday 26 Jun 2023
    */
    filterByField() {
        // filtering
        // create copy of req.query object
        const queryStringFilterObject = {...this.queryString};
        // remove fields not related with filtering from queryStringFilterObject
        const removeFields = ['select', 'sort', 'page', 'limit', "keyword"];
        removeFields.forEach((field) => delete queryStringFilterObject[field]);

        // advanced filtering with operators ($gt, $gte, $lt, $lte, $eq)
        const pattern = /\b(gt|gte|lt|lte|eq)\b/g;
        const queryStringAdvancedFilterObject = JSON.parse(
            JSON.stringify(queryStringFilterObject)
                // replace gte, gt, lte, lt with $gte, $gt, $lte, $lt
                .replace(pattern, match => `$${match}`)
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
    pagination(countDocuments) {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 5;
        const skip = (page - 1) * limit;
        const endIndexOfCurrentPage = page * limit;

        // pagination results
        const paginationDetails = {
            currentPage: page,
            nextPage: (endIndexOfCurrentPage < countDocuments) ? page + 1 : null,
            previousPage: (page > 1) ? page - 1 : null,
            limit,
            numberOfPages: Math.ceil(countDocuments / limit),
        };


        this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = paginationDetails;
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
                    {name: {$regex: keyword, $options: 'i'}},
                ]
            };
            this.mongooseQuery.find(keywordSearchObject);
        }
        return this;
    }
}

module.exports = ApiFeatures;