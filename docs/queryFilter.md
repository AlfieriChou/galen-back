# query filter

## where

- $eq: Sequelize.Op.eq
- $ne: Sequelize.Op.ne
- $gte: Sequelize.Op.gte
- $gt: Sequelize.Op.gt
- $lte: Sequelize.Op.lte
- $lt: Sequelize.Op.lt
- $not: Sequelize.Op.not
- $in: Sequelize.Op.in
- $notIn: Sequelize.Op.notIn
- $is: Sequelize.Op.is
- $like: Sequelize.Op.like
- $notLike: Sequelize.Op.notLike
- $iLike: Sequelize.Op.iLike
- $notILike: Sequelize.Op.notILike
- $regexp: Sequelize.Op.regexp
- $notRegexp: Sequelize.Op.notRegexp
- $iRegexp: Sequelize.Op.iRegexp
- $notIRegexp: Sequelize.Op.notIRegexp
- $between: Sequelize.Op.between
- $notBetween: Sequelize.Op.notBetween
- $overlap: Sequelize.Op.overlap
- $contains: Sequelize.Op.contains
- $contained: Sequelize.Op.contained
- $adjacent: Sequelize.Op.adjacent
- $strictLeft: Sequelize.Op.strictLeft
- $strictRight: Sequelize.Op.strictRight
- $noExtendRight: Sequelize.Op.noExtendRight
- $noExtendLeft: Sequelize.Op.noExtendLeft
- $and: Sequelize.Op.and
- $or: Sequelize.Op.or
- $any: Sequelize.Op.any
- $all: Sequelize.Op.all
- $values: Sequelize.Op.values
- $col: Sequelize.Op.col

```
where={"nickname":{"$like":"%abc%"}}
```

## order

```
order=[["createdAt", "desc"]]
```

## include

- model
- as
- where
- order
- include

```
include=[{"model":"UserRole","include":[{"model":"Role"}]}]
```

## limit - default 20

```
limit=20
```

## offset - default 0

```
limit=0
```

## example:

```
v1/users?{"nickname":{"$like":"%abc%"}}&offset=0&limit=10&order=[["createdAt", "desc"]]&include=[{"model":"UserRole","include":[{"model":"Role"}]}]
```