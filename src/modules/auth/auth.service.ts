import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto, UserSignUpDto } from 'src/modules/users/dto/Users.dto';
import { Users } from 'src/modules/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly usersDb: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpData: UserSignUpDto) {
    if (await this.usersDb.findOne({ where: { email: signUpData.email } })) {
      throw new BadRequestException('Email ya registrado');
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    signUpData.password = await bcrypt.hash(signUpData.password, 10);
    const newUser = this.usersDb.create(signUpData);
    await this.usersDb.save(newUser);
    const userwithoutPassword = {
      ...newUser,
      password: undefined,
      confirmPassword: undefined,
      isAdmin: undefined,
    };
    return userwithoutPassword;
  }

  async signIn(signInData: UserLoginDto) {
    const { email, password } = signInData;

    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }
    const user = await this.usersDb.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email o password incorrectos');
    }

    if (!user.isActive) {
      throw new BadRequestException('Cuenta de usuario desactivada');
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      };
      const accessToken = this.jwtService.sign(payload);
      return { message: `Bienvenido ${user.name}`, accessToken };
    }
    throw new BadRequestException('Email o password incorrectos');
  }
}
