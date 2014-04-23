# Cortex Search Server

Cortex Search Site.

## Run

Clone the project from git:

```
git clone https://github.com/cortexjs/cortex-search-server.git
```

Go to the project and  start the server:

```
npm install
npm run start
```


## Rest APIs

### /rest/package/:name/[:version]

Get package information of a package with name and version, version is optional.


### /rest/search

Search packages with criterias.

#### Query Parameters

* q: search by words, which the words will contains in name, description and keywords; words are separete by space
* keyword: search packages by keywords
* name: search packages by name
* author: search packages by author's name
* skip: number of results will be skiped (As the search is handle by couchdb view/list, skip is not efficient as other search engine, so be carefull about skip, a big number of skip will have performance issue)
* limit: max length of results that return


## Note

If the packages(doc count in couchdb/registry) exceeds 10000+, it may has problem in search performance. Elasticsearch and standalone sever may require for search server.

### License 

(The MIT License)
