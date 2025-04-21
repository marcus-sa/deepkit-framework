export const enum MappedModifier {
    optional = 1,
    removeOptional = 2,
    readonly = 4,
    removeReadonly = 8
}
/**
 * note: Checks are based on range checks (>, <, etc), so when adding
 * new types a check is required for all code using `TypeNumberBrand`.
 */
export enum TypeNumberBrand {
    integer = 0,
    int8 = 1,
    int16 = 2,
    int32 = 3,
    uint8 = 4,
    uint16 = 5,
    uint32 = 6,
    float = 7,
    float32 = 8,
    float64 = 9
}
/**
 * The instruction set.
 * Should not be greater than 93 members, because we encode it via charCode starting at 33. +93 means we end up with charCode=126
 * (which is '~' and the last char that can be represented without \x. The next 127 is '\x7F').
 */
export enum ReflectionOp {
    never = 0,
    any = 1,
    unknown = 2,
    void = 3,
    object = 4,
    string = 5,
    number = 6,
    numberBrand = 7,
    boolean = 8,
    bigint = 9,
    symbol = 10,
    null = 11,
    undefined = 12,
    /**
     * The literal type of string, number, or boolean.
     *
     * This OP has 1 parameter. The next byte is the absolute address of the literal on the stack, which is the actual literal value.
     *
     * Pushes a function type.
     */
    literal = 13,
    /**
     * This OP pops all types on the current stack frame.
     *
     * This OP has 1 parameter. The next byte is the absolute address of a string|number|symbol entry on the stack.
     *
     * Pushes a function type.
     */
    function = 14,
    /**
     * This OP pops all types on the current stack frame.
     *
     * Pushes a method type.
     */
    method = 15,
    methodSignature = 16,//has 1 parameter, reference to stack for its property name
    parameter = 17,
    /**
     * This OP pops the latest type entry on the stack.
     *
     * Pushes a property type.
     */
    property = 18,
    propertySignature = 19,//has 1 parameter, reference to stack for its property name
    /**
     * This OP pops all types on the current stack frame. Those types should be method|property.
     *
     * Pushes a TypeClass onto the stack.
     */
    class = 20,
    /**
     * If a class extends another class with generics, this OP represents the generic type arguments of the super class.
     *
     * e.g. `class A extends B<string, boolean>`, string and boolean are on the stack and classExtends pops() them, and then assigns to A.extendsTypeArguments = [string, boolean].
     *
     * This is only emitted when the class that is currently being described actually extends another class and uses generics.
     *
     * This OP has 1 argument and pops x types from the stack. X is the first argument.
     * Expects a TypeClass on the stack.
     */
    classExtends = 21,
    /**
     * This OP has 1 parameter, the stack entry to the actual class symbol.
     */
    classReference = 22,
    /**
     * Marks the last entry in the stack as optional. Used for method|property. Equal to the QuestionMark operator in a property assignment.
     */
    optional = 23,
    readonly = 24,
    public = 25,
    private = 26,
    protected = 27,
    abstract = 28,
    defaultValue = 29,
    description = 30,
    rest = 31,
    regexp = 32,
    enum = 33,
    enumMember = 34,//has one argument, the name.
    set = 35,
    map = 36,
    /**
     * Pops the latest stack entry and uses it as T for an array type.
     *
     * Pushes an array type.
     */
    array = 37,
    tuple = 38,
    tupleMember = 39,
    namedTupleMember = 40,//has one argument, the name.
    union = 41,//pops frame. requires frame start when stack can be dirty.
    intersection = 42,
    indexSignature = 43,
    objectLiteral = 44,
    mappedType = 45,//2 parameters: functionPointer and modifier.
    in = 46,
    frame = 47,//creates a new stack frame
    moveFrame = 48,//pop() as T, pops the current stack frame, push(T)
    return = 49,
    templateLiteral = 50,
    date = 51,
    int8Array = 52,
    uint8ClampedArray = 53,
    uint8Array = 54,
    int16Array = 55,
    uint16Array = 56,
    int32Array = 57,
    uint32Array = 58,
    float32Array = 59,
    float64Array = 60,
    bigInt64Array = 61,
    arrayBuffer = 62,
    promise = 63,
    arg = 64,//@deprecated. parameter is a number referencing an entry in the stack, relative to the beginning of the current frame, *-1. pushes that entry onto the stack. this is related to the calling convention.
    typeParameter = 65,//generic type parameter, e.g. T in a generic. has 1 parameter: reference to the name.
    typeParameterDefault = 66,//generic type parameter with a default value, e.g. T in a generic. has 1 parameter: reference to the name. pop() for the default value
    var = 67,//reserve a new variable in the stack
    loads = 68,//pushes to the stack a referenced value in the stack. has 2 parameters: <frame> <index>, frame is a negative offset to the frame, and index the index of the stack entry withing the referenced frame
    indexAccess = 69,//T['string'], 2 items on the stack
    keyof = 70,//keyof operator
    infer = 71,//2 params, like `loads`
    typeof = 72,//1 parameter that points to a function returning the runtime value from which we need to extract the type
    condition = 73,
    jumpCondition = 74,//@deprecated. used when INFER is used in `extends` conditional branch. 2 args: left program, right program
    jump = 75,//jump to an address
    call = 76,//has one parameter, the next program address. creates a new stack frame with current program address as first stack entry, and jumps back to that + 1.
    inline = 77,
    inlineCall = 78,
    distribute = 79,//has one parameter, the co-routine program index.
    extends = 80,//X extends Y in a conditional type, XY popped from the stack, pushes boolean on the stack
    widen = 81,//widens the type on the stack, .e.g 'asd' => string, 34 => number, etc. this is necessary for infer runtime data, and widen if necessary (object member or non-contained literal)
    static = 82,
    mappedType2 = 83,//same as mappedType2 but the given functionPointer returns a tuple [type, name]
    functionReference = 84,//Same as classReference but for functions
    callSignature = 85,//Same as function but for call signatures (in object literals)
    /**
     * Assign for Enum, Interface, Class, and TypeAlias declaration at the very end
     * of the program the typeName. This is so that we have type names available even
     * if the JS code is minified.
     *
     * his operator also assigns originTypes to the type, as it acts as the finalization
     * step of a type.
     */
    typeName = 86,//has one parameter, the index of the stack entry that contains the type name. Uses current head of the stack as type and assigns typeName to it.
    /**
     * If a class implement an interface or type,
     *
     * e.g. `class A implements B`, then B is on the stack and implements pops() it, and then assigns to A.implements = [B].
     *
     * This is only emitted when the class that is currently being described actually implements something.
     *
     * This OP has 1 argument and pops x types from the stack. X is the first argument.
     * Expects a TypeClass on the stack.
     */
    implements = 87,//pops one type from the stack and assigns it to the latest class on the stack as `implements` type.
    nominal = 88
}
