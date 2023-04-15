use dep::std;

fn main(
    role: u4,
    salt: u32,
    roleHash: Field
) {
    constrain role < 2;
    let hash = std::hash::pedersen([role as Field, salt as Field])[0];
    constrain roleHash == hash;
}
