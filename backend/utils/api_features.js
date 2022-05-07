class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                //find all the name with requested name as substring
                $options : "i",//case insensitive
            },
        }:{};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};
        //in js all the objects pass through refrence
        //so to avoid change to happen in original object we do {...this.queryStr}
        
        const removedfields = ["keyword","page","limit"];
        removedfields.forEach(key=>delete queryCopy[key]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);


        //Product.find()=this.query | in queryCopy there is only catogery
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page)||1;

        const skip = resultPerPage * (currentPage-1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;