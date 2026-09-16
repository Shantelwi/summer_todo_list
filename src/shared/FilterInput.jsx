function FilterInput({filterTerm, onFilterChange}) {
    return(
        <>
            <div className="search-input">
                <label htmlFor="filterInput">
                    Search todos
                </label>
                    <input 
                        id="filterInput"
                        type="text" 
                        value={filterTerm}
                        onChange={(e) => onFilterChange(e.target.value)}
                        placeholder="Search by title..."
                        maxLength={100}
                    />
            </div>
        </>
    )
}
export default FilterInput;