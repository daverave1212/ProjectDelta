# ProjectDelta
ProjectDelta is a programming language as a successor to my CS graduation project, Waxx
Cloned.




a + b + c
    (|)
    (a|)
    (a, |)

((b, c), |)

a + b * c + d
    a
    +(a)
    +(a, b)
    +(a, *(b))
    +(a, *(b, c))
    +(a, *(b, c))

    (a, |)
    (a, b)|
    (a, b|) -> (a, (b, |))
    (a, (b, c)|)


$line:
    Atom:
        add()
    Operator:
        ==:
            wrapOver()
            state = $-operator-second
        priority:
            in_last_expression...

$operator-second
    Atom:
        add()
        brateIn()

