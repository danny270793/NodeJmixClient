export default interface Query {
    name: string
    jpql: string
    entityName: string
    viewName: string
    params: {
        name: string
        type: string
    }
}
