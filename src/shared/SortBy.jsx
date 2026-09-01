function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
    return (
        <>
            <label htmlFor="sortBy">Sort by</label>
            <select
                name="Sort by"
                id="sortBy"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}>
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
            </select>

            <label htmlFor="sortDirection">Order</label>
            <select
                name="Order"
                id="sortDirection"
                value={sortDirection}
                onChange={(e) => onSortDirectionChange(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </>
    );
}
export default SortBy;