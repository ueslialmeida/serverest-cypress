import { faker } from '@faker-js/faker'

export const generateUserPayload = (isAdmin = 'false') => {
    return {
        nome: faker.internet.displayName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: isAdmin
    }
}

export const generateProductPayload = () => {
    return {
        nome: faker.commerce.productName(),
        preco: 150,
        descricao: faker.commerce.productDescription(),
        quantidade: 42
    }
}