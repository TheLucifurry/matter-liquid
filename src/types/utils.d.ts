type UPrefixed<Prefix extends string, ObjectType> = {
  [Props in keyof ObjectType as `${Prefix}${string & Props}`]: ObjectType[Props]
};
