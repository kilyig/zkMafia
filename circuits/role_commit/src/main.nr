use dep::std;

fn main(
    role: u4,
    salt: u32
) -> pub Field {
    constrain role < 2;
    std::hash::pedersen([role as Field, salt as Field]);
}


