module.exports = test => {
    // EmptyStatement
    test(`;`,
    {
        type: "Program",
        body: [
          {
            type: "EmptyStatement"
          }
        ]
    })
}