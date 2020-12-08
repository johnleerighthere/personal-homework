const schema = {

    properties: {
        name: {
            type: "string",
            minLength: 3,
            maxLength: 50
        },
        email: {
            type: "string",
            minLength: 3,
            maxLength: 50
        },
        password: {
            type: "string",
            minLength: 5,
            maxLength: 50
        },

        address: {
            type: "string",
            minLength: 5,
        },
        phone: {
            type: "string",
            minLength: 6,
        },
    }


}

export default schema